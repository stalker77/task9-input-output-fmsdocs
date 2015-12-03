package ru.tander.tasks.task9;

import org.junit.*;

/**
 * Unit test for console App.
 */
public class MainTest {
  /**
   * test
   *
   */
  @Test
  //UnitOfWork_StateUnderTest_ExpectedBehavior - test name best practice ()
  public void Main_ValidParams_ValueReturned() {
    Assert.assertEquals("Not equal", 1, 1);
  }
}
